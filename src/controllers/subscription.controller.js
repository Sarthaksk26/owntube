import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { userId } = req.user; // Assuming userId is available in req.user (from authentication middleware)

    // Validate required fields
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID is missing");
    }

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({ 
        subscriber: userId, 
        channel: channelId 
    });

    if (existingSubscription) {
        // If subscription exists, remove it (unsubscribe)
        await existingSubscription.deleteOne();
        return res.status(200).json(
            new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
        );
    } else {
        // If subscription doesn't exist, create it (subscribe)
        const newSubscription = await Subscription.create({ 
            subscriber: userId, 
            channel: channelId 
        });

        return res.status(200).json(
            new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
        );
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if(!channelId){
        throw new ApiError(400, "Channel ID is required")
    }

    const users = await Subscription.find({channel : channelId}).populate("subscriber", "username email")

    if (!subscribers || subscribers.length === 0) {
        throw new ApiError(404, "No subscribers found for this channel");
    }

    const subscriberList = subscribers.map((sub) => sub.subscriber);

    return res.status(200).json(
        new ApiResponse(200, subscriberList, "Subscribers retrieved successfully")
    );
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    
        const { subscriberId } = req.params;
    
        // Validate subscriber ID
        if (!subscriberId) {
            throw new ApiError(400, "Subscriber ID is required");
        }
    
        // Fetch subscriptions for the subscriber
        const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'name');
    
        // Check if the subscriber has any subscriptions
        if (!subscriptions || subscriptions.length === 0) {
            throw new ApiError(404, "No subscriptions found for the subscriber");
        }
    
        // Extract channel details from subscriptions
        const subscribedChannels = subscriptions.map((sub) => sub.channel);
    
        // Send the response
        return res.status(200).json(
            new ApiResponse(200, subscribedChannels, "Subscribed channels retrieved successfully")
        );
    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}