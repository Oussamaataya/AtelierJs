const express = require("express");
const students = require("../model/students");


// la rcherche de tous les utilisateurs
async function getall(req, res) {
    try {
        const data = await students.find();
        res.send(data);
    } catch (err) {
        res.send(err);
    }
}

// la recherche par id
async function getbyid(req, res) {
    try {
        const data = await students.findById(req.params.id);
        if (!data) {
            return res.status(404).send("Étudiant introuvable");
        }
        res.send(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


// l'ajout d'un utilisateur
async function add(req, res, next) {
    try {
        const newStudent = new students(req.body);
        await newStudent.save();
        res.status(200).send("Student ajouté avec succès");
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

module.exports = { getall, getbyid , add };


