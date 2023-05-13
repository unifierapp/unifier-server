import axios from "axios";
import dotenv from 'dotenv';
import typeIs from "type-is";
import * as mimeTypes from "mime-types";


dotenv.config();

const url = 'https://instagram.fhan17-1.fna.fbcdn.net/v/t50.2886-16/343950560_188824503987975_8958947983720684437_n.mp4?efg=eyJxZV9ncm91cHMiOiJbXCJpZ19wcm9ncmVzc2l2ZV91cmxnZW4ucHJvZHVjdF90eXBlLmFkXCJdIn0&_nc_ht=instagram.fhan17-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=x1zhi4emGPgAX8HY3TI&edm=AJ9x6zYBAAAA&ccb=7-5&oh=00_AfA3wIZF2b-R4GzWaTAY2x_NaQnue1z3M5Wwc_KzIlHVaw&oe=6460F44F&_nc_sid=cff2a4';
const data = mimeTypes.lookup(new URL(url).pathname);

console.log(data)