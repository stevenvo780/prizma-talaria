import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './users';
import { SharedProp } from './sharedProp.helper';

/**
 * Subscription — registro de suscripción de plan de empresa (Talaria).
 *
 * Reemplaza la entidad `Wompi` tras la migración a Mercado Pago (paquete
 * `prizma-payments` (Prizma), cuenta CENTRAL). Es agnóstica de pasarela: guarda el
 * estado del plan (`plan`, `status`, `valid`) que el resto de la app consume
 * para validar el cupo del comercio (login, Order, DomiciliaryCompany).
 *
 * Migración del modelo Wompi → MP:
 *   - `transactionId`/`tokenPay`/`dataUser` (tokenización manual de tarjeta) →
 *     ELIMINADOS. MP cobra de forma recurrente nativa vía PreApproval; ya no
 *     guardamos tokens de tarjeta ni hacemos `rePay` manual.
 *   - `preapprovalId` — id de la PreApproval de MP (recurrencia nativa).
 *   - `externalReference` — `talaria:plan:<userId>` (convención del Hub).
 *   - `status` — estado crudo de la suscripción MP normalizado a mayúsculas
 *     del flujo histórico (`PENDING` | `APPROVED` | `DECLINED`) para no romper
 *     a los consumidores existentes de `validatePayInUser`.
 */
@Entity()
export class Subscription extends SharedProp {
	@Index()
	@PrimaryGeneratedColumn()
	id: number;

	/** Id de la PreApproval (suscripción recurrente) en Mercado Pago. */
	@Column({ type: 'text', default: '' })
	preapprovalId: string;

	/** Referencia de negocio: `talaria:plan:<userId>` (convención del Hub). */
	@Column({ type: 'text', default: '' })
	externalReference: string;

	/** Email del pagador con el que se creó la PreApproval. */
	@Column({ type: 'text', default: '' })
	payerEmail: string;

	@Column({ default: 'free' })
	plan: string;

	@Column({ default: 'PENDING' })
	status: string;

	@Column( { default: false } )
	valid: boolean;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;
}
