const Schedule = require('../models/schedule');
const Customer = require('../models/customer')
const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');

// add schedule
const addSchedule = async(req, res) => {
    let userId = req.cookies['userId'];
    userId = new ObjectId(userId);

    let customerEmail = req.body.emailAddress
    // check customer exist
    try{
        let customerDetail = await Customer.findOne({userId: userId, emailAddress: customerEmail}, {_id: true})
        if (customerDetail) {
            //pass
        } else {
            console.log("no such customer: ", customerId)
            return res.redirect('/404-NOT-FOUND')
        }
        const newSchedule = new Schedule({
            userId: userId,
            customerId: customerDetail._id,
            time: req.body.time,
            type: req.body.type,
            notes: req.body.note
        })
        
        // push order to database
        await newSchedule.save((err, result) => {
            if (err) {
                console.log("failed to save schedule to the database!")
                return res.status(500).json({ msg: err });
            }
            console.log("Schedule", newSchedule._id, "added successfully!");
            return res.status(200).json(newSchedule);
        })
    } catch (err) {
        console.log("Database query collection 'customers' failed!")
        return res.status(500).json({ msg: 'could not find customer' })
    }
    
}

// update schedule status
const updateScheduleStatus = async(req, res) => {
    let scheduleId = req.params.scheduleId
    try{
        let status = req.body.status
        await Schedule.updateOne({_id: scheduleId}, {$set: {status: status}})

        let schedule = await Schedule.findOne({_id: scheduleId});
        if (schedule) {
            console.log("Update schedule successfully")
            return res.status(200).json(schedule);
        } else {
            console.log("could not find product")
            return res.status(500).json({ msg: 'could not find product' })
        }
    } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err })
    } 
}

// update schedule details
const updateScheduleDetails = async(req, res) => { 
    let scheduleId = req.params.scheduleId
    try{
        let time = req.body.time;
        let type = req.body.type;
        let notes = req.body.notes;

        // update field that changed
        if (time) {
            await Schedule.updateOne({_id: scheduleId}, {$set: {time: time}})
            productRequest = productTag;
        }
        if (type) {
            await Schedule.updateOne({_id: scheduleId}, {$set: {type: type}})
        }

        if (notes) {
            await Schedule.updateOne({_id: scheduleId}, {$set: {notes: notes}})
        }
        
        let schedule = await Schedule.findOne({_id: scheduleId});
        if (schedule) {
            console.log("Update schedule successfully")
            return res.status(200).json(schedule);
        } else {
            console.log("could not find schedule")
            return res.status(500).json({ msg: 'could not find schedule' })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: err })
    } 
}

// get all schedule
const getAllSchedule = async(req, res) => {
    let userId = req.cookies['userId'];
    userId = new ObjectId(userId);

    try{
        const schedules = await Schedule.find({userId: userId}, {_id: false, userId: false}).populate("customerId", "-_id").lean()

        if (schedules.length == 0) {
            return res.json("No schedule")
        }

        return res.status(200).json(schedules)
    }catch (err) {
        console.log("failed to get schedule to the database!")
        return res.status(500).json({ msg: err });
    }
}

module.exports = {addSchedule, updateScheduleDetails, updateScheduleStatus, getAllSchedule}