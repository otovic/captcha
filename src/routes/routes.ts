import { Router } from "express"
import { authenticate } from "../middlewares/auth_middleware";
import { insertCaptcha, validateCaptcha } from "../services/captcha_service";

const router = Router();

router.get('/generateCaptcha', insertCaptcha);
router.post('/validate_captcha', authenticate, validateCaptcha);

export default router;