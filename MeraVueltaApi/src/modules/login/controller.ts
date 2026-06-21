import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Connection } from 'typeorm';
import { User, UserRoleOptions } from '../../entities/users';
import { UsersEmailToken } from '../../entities/usersEmailToken';
import { UsersPasswordRecoveryToken } from '../../entities/usersPasswordRecoveryToken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { createUserTokenPair, hashRefreshToken, verifyToken, createAccessToken } from '../../utils/token';
import { sendEmail, TEMPLATES_EMAIL, parameterEmail } from '../../utils/mailJet';
import { Wompi } from '../../entities/wompi';
import { validatePayment } from '../PayUsers/services';

/**
 * Get API service status
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function authenticate(
  req: Hapi.request
): Promise<
  | {
      user: User;
      token: string;
      accessToken: string;
      refreshToken: string;
      validatePay: boolean;
      plan: string;
    }
  | { message: string }
  | null
> {
  const connection: Connection = req.server.app.connection;
  const { email, password } = req.payload;

  const user = await connection.manager.findOne(User, {
    where: { email: email },
  });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const payUser = await connection.manager.findOne(Wompi, { where: { user: user.id } });
      let validatePay = false;
      if (payUser) {
        if (payUser.valid) {
          validatePay = true;
        } else {
          const validate = await validatePayment(user, connection.manager);
          if (validate) {
            validatePay = true;
          } else {
            validatePay = false;
          }
        }
      } else {
        validatePay = false;
      }
      // Crear par de tokens: access (corto) + refresh (largo)
      const { accessToken, refreshToken, refreshTokenExpiresAt } = createUserTokenPair(user);

      // Guardar refresh token hasheado y expiración en BD
      user.refreshToken = hashRefreshToken(refreshToken);
      user.refreshTokenExpiresAt = refreshTokenExpiresAt;
      user.lastLoginAt = new Date();
      user.isActive = true; // Asegurar que el usuario esté activo

      try {
        await connection.manager.save(user);
      } catch (error) {
        throw Boom.internal('Error al guardar el usuario');
      }

      return {
        user,
        token: accessToken, // Usar como token principal (compatibilidad hacia atrás)
        accessToken, // Explícito para clientes nuevos
        refreshToken, // Enviar al cliente para refresh (no guardar en server)
        validatePay,
        plan: payUser?.plan ? payUser.plan : 'free',
      };
    } else {
      return { message: 'Contraseña erronea' };
    }
  }
  return { message: 'Contraseña erronea' };
}

/**
 * Get API service status
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function register(
  req: Hapi.request
): Promise<User | undefined | unknown> {
  const connection: Connection = req.server.app.connection;
  const {
    email,
    password,
    name,
    lastName,
    bornDate,
    role,
    address,
    clientPhone,
    typeDocument,
    documentNumber,
    companyName,
    prefix
  } = req.payload;
  const userExistEmail = await connection.manager.findOne(User, {
    where: { email: email },
  });
  if (userExistEmail) {
    return { message: 'Ya existe un usuario con este correo' };
  }
  const userExistDocument = await connection.manager.findOne(User, {
    where: { documentNumber: documentNumber },
  });
  if(userExistDocument){
    return { message: 'Ya existe un usuario con este documento' };
  }
  const user = new User();
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.bornDate = bornDate;
  user.address = address;
  user.clientPhone = clientPhone;
  user.typeDocument = typeDocument;
  user.documentNumber = documentNumber;
  user.companyName = companyName;
  user.prefix = prefix;
  if (role !== 'admin') {
    user.role = role;
  } else {
    user.role = UserRoleOptions.COMPANY;
  }
  const passwordHash = await bcrypt.hash(password, 13);
  user.password = passwordHash;
  user.confirmEmail = false;

  try {
    const userSave = await connection.manager.save(user);
    const userEmailToken = new UsersEmailToken();
    userEmailToken.token = uuidv4();
    userEmailToken.user = userSave;
    const emailData = {
      name: user.name,
      confirmation_link: `${process.env.HOST_FROND}/confirmEmail/${userEmailToken.token}`,
    };
    const parameter = await parameterEmail(TEMPLATES_EMAIL.WELCOME, user.name, user.email, emailData);

    await sendEmail(parameter.from, parameter.to, parameter.template, 'Bienvenido', parameter.data);
    await connection.manager.save(userEmailToken);
    return userSave;
  } catch (error) {
    console.error(error);
    throw Boom.internal('Error al guardar el usuario');
  }
}

/**
 * Confirm email
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function confirmEmail(
  req: Hapi.request
): Promise<{ user: User; token: string; accessToken: string; refreshToken: string }> {
  const connection: Connection = req.server.app.connection;
  const { token } = req.params;
  const userEmailToken = await connection.manager.findOne(UsersEmailToken, {
    where: { token: token }, relations: ['user'],
  });
  if (userEmailToken) {
    const user = await connection.manager.findOne(User, {
      where: { id: userEmailToken.user.id },
    });
    if (user) {
      user.confirmEmail = true;
      try {
        await connection.manager.remove(userEmailToken);

        // Crear tokens y guardar refresh token en BD
        const { accessToken, refreshToken, refreshTokenExpiresAt } = createUserTokenPair(user);
        user.refreshToken = hashRefreshToken(refreshToken);
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        user.isActive = true;

        await connection.manager.save(user);
        return { user, token: accessToken, accessToken, refreshToken };
      } catch (error) {
        console.error(error);
        throw Boom.internal('Error al guardar el usuario');
      }
    } else {
      throw Boom.notFound('No se encontró el usuario');
    }
  } else {
    throw Boom.notFound('No se encontró el token');
  }
}

/**
 * re send confirm email
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function reSendConfirmEmail(
  req: Hapi.request
): Promise<boolean> {
  const connection: Connection = req.server.app.connection;
  const userAuth = req.auth.credentials;
  const email = req.payload.email;
  let user: any = null;
  if (email) {
    user = await connection.manager.findOne(User, { where: { email: email } });
  } else {
    if (userAuth?.id) {
      user = await connection.manager.findOne(User, { where: { id: userAuth.id } });
    } else {
      throw Boom.notFound('No se encontró el usuario');
    }
  }
  if (user) {
    let userEmailToken = await connection.manager.findOne(UsersEmailToken, { where: { user: user } });
    if (userEmailToken) {
      await connection.manager.remove(userEmailToken);
    }
    userEmailToken = new UsersEmailToken();
    userEmailToken.token = uuidv4();
    userEmailToken.user = user;
    const emailData = {
      name: user.name,
      confirmation_link: `${process.env.HOST_FROND}/confirmEmail/${userEmailToken.token}`,
    };
    const parameter = await parameterEmail(TEMPLATES_EMAIL.WELCOME, user.name, user.email, emailData);
    await sendEmail(parameter.from, parameter.to, parameter.template, 'Bienvenido', parameter.data);
    await connection.manager.save(userEmailToken);
    return true;
  } else {
    throw Boom.notFound('No se encontró el usuario');
  }
}

/**
 * recover password send email
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function recoverPasswordSendEmail(
  req: Hapi.request
): Promise<boolean> {
  const connection: Connection = req.server.app.connection;
  const { email } = req.payload;
  const user = await connection.manager.findOne(User, { where: { email: email } });
  if (user) {
    let userPasswordToken = await connection.manager.findOne(UsersPasswordRecoveryToken, { where: { user: user } });
    if (userPasswordToken) {
      await connection.manager.remove(userPasswordToken);
    }
    userPasswordToken = new UsersPasswordRecoveryToken();
    userPasswordToken.token = uuidv4();
    userPasswordToken.user = user;
    const emailData = {
      name: user.name,
      confirmation_link: `${process.env.HOST_FROND}/recoverPassword/${userPasswordToken.token}`,
    };
    const parameter = await parameterEmail(TEMPLATES_EMAIL.RECOVER_PASSWORD, user.name, user.email, emailData);
    await sendEmail(parameter.from, parameter.to, parameter.template, 'Recuperar contraseña', parameter.data);
    await connection.manager.save(userPasswordToken);
    return true;
  } else {
    throw Boom.notFound('No se encontró el usuario');
  }
}

/**
 * recover password
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
*/
export async function recoverPassword(
  req: Hapi.request
): Promise<{ user: User; token: string; accessToken: string; refreshToken: string }> {
  const connection: Connection = req.server.app.connection;
  const { password, token } = req.payload;
  const userPasswordToken = await connection.manager.findOne(UsersPasswordRecoveryToken, {
    where: { token: token }, relations: ['user'],
  });
  if (userPasswordToken) {
    const user = await connection.manager.findOne(User, {
      where: { id: userPasswordToken.user.id },
    });
    if (user) {
      try {
        const passwordHash = await bcrypt.hash(password, 13);
        user.password = passwordHash;
        await connection.manager.remove(userPasswordToken);

        // Crear tokens y guardar refresh token en BD
        const { accessToken, refreshToken, refreshTokenExpiresAt } = createUserTokenPair(user);
        user.refreshToken = hashRefreshToken(refreshToken);
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;
        user.isActive = true;

        await connection.manager.save(user);
        return { user, token: accessToken, accessToken, refreshToken };
      } catch (error) {
        console.error(error);
        throw Boom.internal('Error al guardar el usuario');
      }
    } else {
      throw Boom.notFound('No se encontró el usuario');
    }
  } else {
    throw Boom.notFound('No se encontró el token');
  }
}

/**
 * send email question
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
*/
export async function emailQuestion(
  req: Hapi.request
): Promise<boolean> {
  const { name, mail, phone, message } = req.payload;
  try {
    const emailData = {
      name: name,
      mail: mail,
      phone: phone,
      message: message,
    };
    if (process.env.MAIL_QUESTIONS) {
      const parameter = await parameterEmail(TEMPLATES_EMAIL.QUESTION_EMAIL, 'Mera Vuelta', process.env.MAIL_QUESTIONS, emailData);
      await sendEmail(emailData.mail, parameter.to, parameter.template, 'Pregunta', parameter.data);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw Boom.internal('Error al guardar el usuario');
  }
}

/**
 * Refresh Token Endpoint
 * Intercambia un refresh token válido por un nuevo access token.
 * El refresh token debe haber sido guardado en BD durante login.
 *
 * @param {Hapi.request} req Request con { refreshToken } en payload
 * @returns {Promise<{ accessToken: string; expiresIn: string }>}
 */
export async function refreshAccessToken(req: Hapi.request): Promise<
  | { accessToken: string; expiresIn: string }
  | { message: string }
> {
  try {
    const connection: Connection = req.server.app.connection;
    const { refreshToken } = req.payload as { refreshToken: string };

    if (!refreshToken) {
      return { message: 'Refresh token requerido' };
    }

    // Verificar que el refresh token es válido (sintaxis JWT)
    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh') {
      return { message: 'Refresh token inválido o expirado' };
    }

    // Buscar el usuario y verificar que el refresh token coincida (hasheado)
    const userId = decoded.id as number;
    const user = await connection.manager.findOne(User, {
      where: { id: userId },
    });

    if (!user) {
      return { message: 'Usuario no encontrado' };
    }

    if (!user.isActive) {
      return { message: 'Usuario desactivado' };
    }

    // Verificar que el refresh token guardado en BD coincide
    const refreshTokenHash = hashRefreshToken(refreshToken);
    if (user.refreshToken !== refreshTokenHash) {
      return { message: 'Refresh token no coincide con el guardado en BD' };
    }

    // Verificar que no ha expirado
    if (!user.refreshTokenExpiresAt || new Date() > user.refreshTokenExpiresAt) {
      return { message: 'Refresh token expirado' };
    }

    // Generar nuevo access token
    const newAccessToken = createAccessToken(user);

    return {
      accessToken: newAccessToken,
      expiresIn: '24h',
    };
  } catch (error) {
    console.error('[RefreshToken] Error:', error);
    throw Boom.internal('Error refrescando token');
  }
}