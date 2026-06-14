import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { Connection } from 'typeorm';
import { User } from '../../entities/users';
import bcrypt from 'bcrypt';
import { UserRoleOptions } from '../../entities/users';
/**
 * Get API service status
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function update(
  req: Hapi.request
): Promise<User | undefined | unknown> {
  const connection: Connection = req.server.app.connection;
  const userId = req.auth.credentials.id;
  const {
    companyName,
    email,
    password,
    name,
    lastName,
    bornDate,
    typeDocument,
    documentNumber,
    role,
    address,
    googleSheets,
    urlPush,
    clientPhone,
    prefix
  } = req.payload;
  const user = await connection.manager.findOne(User, {
    where: { id: userId },
  });
  if (user) {
    if (companyName) {
      user.companyName = companyName;
    }
    if (email) {
      user.email = email;
    }
    if (name) {
      user.name = name;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (bornDate) {
      user.bornDate = bornDate;
    }
    if (typeDocument) {
      user.typeDocument = typeDocument;
    }
    if (documentNumber) {
      user.documentNumber = documentNumber;
    }
    if (role) {
      user.role = role;
    }
    if (address) {
      user.address = address;
    }
    if (googleSheets) {
      user.googleSheets = googleSheets;
    }
    if (urlPush) {
      user.urlPush = urlPush;
    }
    if (password) {
      const passwordHash = await bcrypt.hash(password, 13);
      user.password = passwordHash;
    }
    if (clientPhone) {
      user.clientPhone = clientPhone;
    }
    if(prefix){
      user.prefix = prefix;
    }
    try {
      return await connection.manager.save(user);
    } catch (error) {
      console.error(error);
      throw Boom.internal('Error al guardar el usuario');
    }
  } else {
    throw Boom.notFound('No se encontro el usuario');
  }
}

/**
 * Get API service status
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function getUsersByRoleDomiciliary(
  req: Hapi.request
): Promise<User[] | undefined | unknown> {
  const connection: Connection = req.server.app.connection;
  const users = await connection.manager.find(User, {
    where: { role: UserRoleOptions.DOMICILIARY },
  });
  try {
    return users;
  } catch (error) {
    console.error(error);
    throw Boom.internal('Error al guardar el usuario');
  }
}

/**
 * Get API service status
 *
 * @param {Hapi.request} req Request.
 * @returns {Promise<User>}
 */
export async function getUsersByRoleCompany(
  req: Hapi.request
): Promise<User[] | undefined | unknown> {
  const connection: Connection = req.server.app.connection;
  const users = await connection.manager.find(User, {
    where: { role: UserRoleOptions.COMPANY },
  });
  try {
    return users;
  } catch (error) {
    console.error(error);
    throw Boom.internal('Error al guardar el usuario');
  }
}
