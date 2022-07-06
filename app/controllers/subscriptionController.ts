import { json, NextFunction, Request, Response } from 'express';
import * as subscriptionRepository from '../repositories/subscriptionRepository';
import webpush, { SendResult } from 'web-push';

export const post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subscription = req.body;

    const newSubscription = await subscriptionRepository.create(subscription);

    // Send 201 - resource created
    res.status(201).json(newSubscription);
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const endpoint: string = req.query.endpoint?.toString();
    if (!endpoint) {
      res.sendStatus(400);
      return;
    }

    const successful = await subscriptionRepository.deleteByEndpoint(endpoint);
    if (successful) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    next(e);
  }
};



export const broadcast = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {

    const accountSid = 'ACf6ba3c44675df59d89cc6604f3d39f5b'; 
    const authToken = '5fc0cc9f1d2218f65941c01d13274293';
    const twilio = require('twilio'); 
    const client = new twilio(accountSid, authToken);

    const test = client.messages 
      .create({ 
         body: 'Your Twilio code is 1238432', 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+6285894999562' 
       }) 
      .then((message:any) => console.log(message.sid)) 
      .done();

    const subscriptions = await subscriptionRepository.getAll();

    const notifications: Promise<SendResult>[] = [];
    subscriptions.forEach((subscription) => {
      notifications.push(webpush.sendNotification(subscription, test));
    });

    await Promise.all(notifications);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {

    const id = req.body.id;
    const password = req.body.password;

    const accountSid = 'ACf6ba3c44675df59d89cc6604f3d39f5b'; 
    const authToken = '5fc0cc9f1d2218f65941c01d13274293';
    const twilio = require('twilio'); 
    const client = new twilio(accountSid, authToken);

    const test = client.messages 
      .create({ 
         body: 'Your String Code : ' + id + password , 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+6285894999562' 
       }) 
      .then((message:any) => console.log(message.sid)) 
      .done();

    const subscriptions = await subscriptionRepository.getAll();

    const notifications: Promise<SendResult>[] = [];
    subscriptions.forEach((subscription) => {
      notifications.push(webpush.sendNotification(subscription, test));
    });

    await Promise.all(notifications);
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};