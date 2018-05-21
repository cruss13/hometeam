const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Authorizer = require("../policies/post");

module.exports = {

  addPost(newPost, callback) {
    return Post.create(newPost)
    .then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getPost(id, callback) {
    return Post.findById(id)
    .then((post) => {
      callback(null, post);
    })
    .catch((err) => {
      callback(err);
    })
  },

//  deletePost(id, callback){
//       return Post.destroy({
//         where: { id }
//       })
//       .then((deletedRecordsCount) => {
//         callback(null, deletedRecordsCount);
//       })
//       .catch((err) => {
//         callback(err);
//       })
//     }

  deletePost(req, callback){
     return Post.findById(req.params.id)
     .then((post) => {
       console.log('delete'+ post)
       const authorized = new Authorizer(req.user, post).destroy();
       if(authorized) {
         post.destroy()
         .then((res) => {
           callback(null, post);
         });
       } else {
         console.log ('delete2'+ post);
         req.flash("notice", "You are not authorized to do that.");
         callback(401);
       }
     })
     .catch((err) => {
       callback(err);
     });
   },

//   deleteTopic(req, callback){
//      return Topic.findById(req.params.id)
//      .then((topic) => {
//        const authorized = new Authorizer(req.user, topic).destroy();
//        if(authorized) {
//          topic.destroy()
//          .then((res) => {
//            callback(null, topic);
//          });
//        } else {
//          req.flash("notice", "You are not authorized to do that.")
//          callback(401);
//        }
//      })
//      .catch((err) => {
//        callback(err);
//      });
//    }

  updatePost(req, updatedPost, callback){
    return Post.findById(req.params.id)
    .then((post) => {
      if(!post){
        return callback("Post not found");
      }
      const authorized = new Authorizer(req.user, post).update();
      if(authorized) {
        post.update(updatedPost, {
          fields: Object.keys(updatedPost)
        })
        .then(() => {
          callback(null, post);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
   }

}
