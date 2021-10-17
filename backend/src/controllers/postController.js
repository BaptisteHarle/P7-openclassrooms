import { Post, User, Comment } from '../data/schema';

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
    res.json({ code: 200, msg: 'Voici les posts.', data: { posts }, errors: [] });
  }

  static async createPost(req, res, next) {
    const { content } = req.body;
    const errors = [];


    if (!content) {
      errors.push('Merci de renseigner un contenu valide.');
    }

    if (errors.length === 0) {
      console.log(req.user);
      const post = await Post.create({
        userId: req.user.id,
        content,
      });

      res.json({ code: 200, msg: "Post créé.", data: { post }, errors });
    } else {
      res.json({ code: 403, msg: "Impossible de créer le post.", data: {}, errors });
    }

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