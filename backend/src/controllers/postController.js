import tmp from 'tmp';
import formidable from 'formidable';
import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';
import Bucketeer from '../utils/Bucketeer';
import { Post, User, Comment } from '../data/schema';

const formatPosts = async (posts) => {
  const bucket = new Bucketeer();
  const nextPosts = cloneDeep(posts);

  // console.log('nextPosts:', nextPosts);
  // Le Saint Graal pour ajouter les URL signées à la place des pictures
  const formatted = await Promise.all(nextPosts.map(async (p) => {
    if (p.dataValues.img) {
      const url = await bucket.getPresignedUrl(p.dataValues.img);
      p.dataValues.img = url;
    }
    return p.dataValues;
  }));

  return formatted;
};

class PostController {
  static async getPost(req, res, next) {
    const { postId } = req.params;
    const post = await Post.findOne({ where: { id: postId } });
    res.json({ code: 200, msg: "Voici le post.", data: { post }, errors: [] });
  }

  static async getPosts(req, res, next) {
    const posts = await Post.findAll({
      include: [User, {
        model: Comment,
        include: [User]
      }],
      order: [['createdAt', 'DESC']]
    });

    const formattedPosts = await formatPosts(posts);
    res.json({ code: 200, msg: 'Voici les posts.', data: { posts: formattedPosts }, errors: [] });
  }

  static async createPost(req, res, next) {

    const bucket = new Bucketeer();

    res.on('finish', () => {
      tmpObj.removeCallback()
    });

    res.on('error', () => {
      tmpObj.removeCallback()
    });

    const tmpObj = tmp.dirSync({ unsafeCleanup: true });
    const form = new formidable.IncomingForm({ uploadDir: tmpObj.name, keepExtensions: true });

    form.parse(req, async (err, fields, files) => {

      const { content } = fields;
      const { img } = files;
      const errors = [];

      if (!content) {
        errors.push('Merci de renseigner un contenu valide.');
      }

      let payload = {
        userId: req.user.id,
        content,
      };

      if (content && img) {
        const fileKey = await bucket.upload({ file: img, id: v4() });
        payload.img = fileKey;
      }


      if (errors.length === 0) {
        console.log(req.user);
        const post = await Post.create(payload);

        res.json({ code: 200, msg: "Post créé.", data: { post }, errors });
      } else {
        res.json({ code: 403, msg: "Impossible de créer le post.", data: {}, errors });
      }

    });

  }

  static async deletePost(req, res, next) {
    const { postId } = req.params;

    const isAdmin = req.user.roleId === 1;
    const condition = isAdmin ? { id: postId } : { id: postId, userId: req.user.id };

    await Post.destroy({
      where: condition,
    });

    res.json({ code: 200, msg: 'Post supprimé.', data: {}, errors: [] });
  }

  static async modifyPost(req, res, next) {
    const { content } = req.body;
    const { postId } = req.params;
    const errors = [];

    if (!content) {
      errors.push('Merci de renseigner un contenu.');
    }

    if (errors.length === 0) {
      const payload = {
        content,
      };

      const post = await Post.update(payload, {
        where: { id: postId, userId: req.user.id },
        returning: true,
        plain: true,
      });

      res.json({ code: 200, msg: "Post modifié.", data: { post }, errors });
    } else {
      res.json({ code: 403, msg: "Impossible de modifier le post.", data: {}, errors });
    }
  }
  
}

export default PostController;