import { cleanEnv, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    KAKAOWORK_API_KEY: str(),
    USERNAME: str(),
    PASSWORD: str(),
  });
};

export default validateEnv;
