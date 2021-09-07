const router=require("express").Router();
const Post=require("../models/Post");
const User=require("../models/User")

// Create a Post
router.post("/",async(req,res)=>{
    const newPost=new Post(req.body);

    try {
        const savedPost=await newPost.save();
        res.status(200).json({status:"success",savedPost});
    } catch (error) {
        res.status(400).json({status:"error",message:"can not create a post"})
    }
})
// update a Post

router.put("/:id",async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
    if(post.userId===req.body.userId){
        await post.updateOne({$set:req.body});
        res.status(200).json({status:"success",message:"Post has been updated"})
    }else{
        res.status(403).json({status:"error",message:"You can update only your posts"})
    }
    } catch (error) {
        res.status(500).json({status:"error",message:error.message});
    }
    
})
// delete a Post

router.delete("/:id",async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
    if(post.userId===req.body.userId){
        await post.deleteOne({_id:req.params.id});
        res.status(200).json({status:"success",message:"Post has been deleted"})
    }else{
        res.status(403).json({status:"error",message:"You can delete only your posts"})
    }
    } catch (error) {
        res.status(500).json({status:"error",message:error.message});
    }
    
})
// like/dislike a Post
router.put("/:id/like",async (req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json({status:"success",message:"post is liked"})
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json({status:"success",message:"post is disliked"})
        }
    } catch (error) {
    res.status(500).json({status:"error",message:error.message});
    }
})
// get a Post

router.get("/:id",async (req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        res.status(200).json({status:"success",message:post});
    } catch (error) {
    res.status(500).json({status:"error",message:error.message});
    }
})
// get timeline posts

router.get("/timeline/all", async(req,res)=>{
    try {
        const currentUser=await User.findById(req.body.userId);
        
        const userPosts=await Post.find({userId:currentUser._id});
        const friendPosts=await Promise.all(
            currentUser.followings.map(friendId=>Post.find({userId:friendId}))
        )
        
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
    res.status(500).json({status:"error",message:error.message});
    }
})


module.exports=router