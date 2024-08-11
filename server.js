const expess = require("express");
const app = expess();
const router = require('./routes/userRoutes')


app.use(expess.json());
app.use(expess.urlencoded({extended: true}));
app.use("/", router);

PORT = process.env.PORT || 8000
app.listen(PORT, function() {
    console.log(`Srver is listening to port ${PORT}`);
});

