import { Controller, Get,Post,Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("list")
  create():string{
    return 
  }

  @Get("user_*")
  getUser(){return "getUser"}
  
  @Put("list/:id")
  update(){ return "update"}

  @Put("list/user")
  updateUser(){
       return {userId:1}
   }
 
}
