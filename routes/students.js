const express = require("express");
const router = express.Router();
const students = require("../model/students");
const studentController = require("../controller/studentController");
const validate = require("../middleware/validatestudent");

router.get('/', (req, res) => { res.end("students"); });

router.get("/test", function(req, res) {
    res.end('teststudents');
});

// Récupérer un étudiant par ID
router.get("/get/:id", studentController.getbyid);

// Récupérer tous les étudiants
router.get("/getall", studentController.getall);

// Ajouter un nouvel étudiant
router.post("/new", validate, studentController.add);

// Mettre à jour un étudiant par ID
router.put("/update/:id", async function (req, res) {
    try {
        const updatedStudent = await students.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).send("Étudiant introuvable");
        }
        res.send(updatedStudent);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Supprimer un étudiant par ID
router.delete("/delete/:id", async function (req, res) {
    const studentId = req.params.id;
    console.log(`Suppression de l'étudiant avec l'ID: ${studentId}`);

    try {
        const deletedStudent = await students.findByIdAndDelete(studentId);
        console.log(deletedStudent);

        if (!deletedStudent) {
            return res.status(404).send("Étudiant introuvable");
        }
        res.send("Étudiant supprimé avec succès");
    } catch (err) {
        console.error(err); // Log l'erreur pour le débogage
        res.status(500).send("Erreur du serveur");
    }
});




module.exports = router;
