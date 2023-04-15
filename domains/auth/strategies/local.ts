import {Strategy} from "passport-local";
import User from "@/models/User";

const localStrategy = new Strategy(User.authenticate());
export default localStrategy;