import { Item } from "src/item/entities/item.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class Category {

@PrimaryGeneratedColumn()
id:number;

@Column({nullable:false})
name:string;

@Column({nullable:true})
image:string 

@OneToMany(()=>Item,(item)=>item.category)
items:Item
@CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
