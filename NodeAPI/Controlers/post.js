const { Result } = require('express-validator');
const Post = require('../Models/post')
const formidable = require('formidable')
const fs = require('fs')
const _ = require("lodash")

// exports.getPosts=(req,res)=>{
// 	res.json({
// 		posts: [
// 			{title: 'First post'}, 
// 			{title: 'Second post'}
// 		]
// 	});
// };



exports.getPosts=(req,res)=>
{ 
	Post.find()
	.populate("postedBy", "_id name")
	.populate("comments", 'text created')
	.populate("comments.postedBy",'_id name')
	.select("_id title body created likes")
	.sort({created:-1})
	.then( (posts)=> { res.json(posts)} )
	.catch( (err)=> { console.log(err)} )
};


exports.createPost = (req,res,next) => {

	let form = new formidable.IncomingForm()
	form.keepExtensions = true
	form.parse(req,(err,fields,files) => {
		if(err)
			return res.status(400).json({error: "Imange not loaded"});
		let post = new Post(fields);
		post.postedBy = req.profile
		if(files.photo)
		{
			post.photo.data = fs.readFileSync(files.photo.path)
			post.photo.contentType = files.photo.type
		}
		post.save( (err,result) => {
			if(err)
				return res.status(400).json({error: err})
			res.json(result)
		})
	})
}


exports.postByUser = (req,res) => {
	Post.find({postedBy: req.profile._id})
		.populate("postedBy", "_id name")
		.select('_id title body created likes')
		.sort("_created")
		.exec( (err,posts) => {
		if(err)
			res.status(400).json({error: err});
		res.json(posts);
	})
}

exports.postById = (req,res,next,id) => {
	Post.findById(id)
	.populate("postedBy", "_id name")
	.populate("comments", 'text created')
	.populate("comments.postedBy",'id name')
	.exec( (err,post) => {
		if(err || !post)
			return res.status(400).json({error: err})
		req.post = post;
		next();
	})
}

exports.isPoster = (req,res,next) => {
	let isPoster = req.post && req.auth && req.post.postedBy._id==req.auth._id
	if(!isPoster)
		return res.status(403).json({error: "User not authorized to delete"})
	next();
}


// exports.updatePost = (req,res,next) => {
// 	let post = req.post
// 	//post = lodash.extend(post, req.body)
// 	post.update = Date.now
// 	post.save( (err) => {
// 		if(err)
// 			return res.status(400).json({error: err})
// 		res.json(post);
// 	})
// }


exports.updatePost= (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err,fields,files) => {
        if (err) {
            return res.status(400).json(
                {
                    error: "Photo couldn't be uploaded"
                })
        }
        let post = req.post
        post = _.extend(post, fields)
        post.updated = Date.now()

        
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType=files.photo.type
        }

        post.save((err, success) => {
            if(err){ 
                return res.status(400).json
                    ({ error: err })
            }
            res.json({post:post});
        })
    })
};


exports.deletePost = (req,res,next) => {
	let post = req.post
	post.remove( (err,post) => {
		if(err)
			return res.status(400).json({error: err});
		res.json({"Message": "Deleted Post!"});
	})
}

exports.photo = (req, res, next) => {
	req.set("Content-Type", req.post.photo.contentType);
	return res.send(req.post.photo.data)
}

exports.singlePost = (req, res) => {
	return res.json(req.post)
}

exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};
exports.comment = (req, res) => {
	let comment = req.body.comment
	comment.postedBy = req.body.userId
	
	Post.findByIdAndUpdate(
		req.body.postId,
		{ $push: { comments: comment } },
		{ new: true })
		.populate('comments.postedBy', "_id name")
		.populate('postedBy',"_id name")
		.exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
}
exports.uncomment = (req, res) => {
    let comment = req.body.comment;

	Post.findByIdAndUpdate(req.body.postId, {
		$pull:{ comments: { _id: comment._id } }}, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};
