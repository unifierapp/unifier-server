export default function logout(req: Express.Request, res: Express.Response) {
    req.logout(() => {
        req.session.destroy(() => {

        });
    });
}