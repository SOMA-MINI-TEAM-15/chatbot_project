import { cleanEnv, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    KAKAOWORK_API_KEY: str(),
  });
};

export default validateEnv;
