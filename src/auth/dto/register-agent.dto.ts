import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterAgentDto {
  @IsString()
  @IsNotEmpty()
  agencyName: string;

  @IsString()
  @IsNotEmpty()
  name: string; // The agent's full name

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
  
  @IsString()
  @IsNotEmpty()
  phone: string;
}