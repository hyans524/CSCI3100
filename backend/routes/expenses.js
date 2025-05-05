const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find().
        populate('group_id').
        populate('paid_by').
        exec();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const expenses = await Expense.findById(req.params.id).
        populate('group_id').
        populate('paid_by').
        exec();
        if (!expenses) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    const expense = new Expense({
        category: req.body.category,
        amount: req.body.amount,
        paid_by: req.body.paid_by,
        group_id: req.body.group_id
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        Object.assign(expense, req.body);
        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        await expense.deleteOne({ _id: req.params.id }).exec();
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 