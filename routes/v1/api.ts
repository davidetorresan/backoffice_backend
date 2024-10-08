import express from "express";
const router: express.Application = express();
import { authenticateToken } from "../../config/jwt";

/* CONTROLLERS */
import * as userController from "../../controllers/user.controller";
import * as docController from "../../controllers/doc.controller";

router.use(express.json());

router.get("/", userController.routeWelcome);

/* USER ROUTES */
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.get("/user/me", authenticateToken, userController.getMe);

/* DOCUMENTS ROUTES */
router.post("/doc/new", authenticateToken, docController.createDoc);
router.delete("/doc/:id", authenticateToken, docController.deleteDoc);
router.get("/doc/:id", authenticateToken, docController.getDoc);
router.get("/doc/list", authenticateToken, docController.listDocs);

export default router;
