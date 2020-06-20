const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)
const express = require('express'); //LIBRERIA NODE JS PARA CREAR SERVIDOR podemos definir las rutas(otro se llama happy server) 
const cors = require('cors')
const router = express();
router.use(cors({
    origin: true
}))
router.get("/product/:id", async (req, res) => {
  const product = await admin
    .firestore()
    .collection("Products")
    .doc(req.params.id)
    .get().then((doc) =>{
      if (doc.exists){
        console.log("Document data:", doc.data());
        return doc.data ()
      } else {
        console.log ("No such document!");
        return{}
      }
    });
  res.send(product);
});

router.get("/products", async (req, res) => {
    const products = await admin
      .firestore()
      .collection("Products")
      .get();
    var lista = [];  products.docs.forEach(doc => {
      lista.push({ id: doc.id, data: doc.data() });
    });
    res.send(lista);
  });
  
  router.post("/product", async (req, res) => {
     await admin
      .firestore()
      .collection("Products")
      .add(req.body);
    res.send(req.body);
  });
  
  router.put("/product/:id", async (req, res) => {
    const product = await admin
      .firestore()
      .collection("Products")
      .doc(req.params.id)
      .update(req.body);
    res.send(product);
  });
  router.delete("/product/:id", async (req, res) => {
    const product = await admin
      .firestore()
      .collection("Products")
      .doc(req.params.id)
      .delete();
    res.send(product);
  });
  
  exports.products = functions.https.onRequest(router);