import { Router } from "express"
import { authenticate } from "../middlewares/auth_middleware";
import { insertCaptcha, validateCaptcha } from "../services/captcha_service";

const router = Router();

router.post('/generateCaptcha', authenticate, insertCaptcha);
router.post('/validateCaptcha', authenticate, validateCaptcha);

export default router;