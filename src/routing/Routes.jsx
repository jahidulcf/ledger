import { createBrowserRouter } from "react-router";
import App from "../App";
import Account from "../components/account/Account";

const router = createBrowserRouter([
    {
        path: "/",
        Component: App
    },
    {
        path: "/account",
        Component: Account
    }
]);

export default router;