import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class DeliveryInformation {

@PrimaryGeneratedColumn()
id:number;

@Column({nullable:false})
firstName:string;
@Column({nullable:false})
lastName:string;
@Column({nullable:false})
email:string;
@Column({nullable:false})
street:string;
@Column({nullable:false})
city:string;
@Column({nullable:false})
state:string;
@Column({nullable:false})
country:string;
@Column({nullable:false})
phone:string;
@Column({nullable:false})
zipCode:string;

}
