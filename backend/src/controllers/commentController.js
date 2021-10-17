import { Comment } from '../data/schema';

class CommentController {
  static async getComment(req, res, next) {
    const { commentId } = req.params;
    const comment = await Comment.findOne({ where: { id: commentId } });
    res.json({ code: 200, msg: 'Voici le commentaire.', data: { comment }, errors: [] });
  }

  static async getComments(req, res, next) {
    const comments = await Comment.findAll();
    res.json({ code: 200, msg: 'Voici les commentaires.', data: { comments }, errors: [] });
  }

  static async createComment(req, res, next) {
    const { content, postId } = req.body;
    const errors = [];

    if (!content) {
      errors.push('Merci de renseigner un contenu.');
    }
    if (!postId) {
      errors.push('Petit malin cela ne marche pas.');
    }

    if (errors.length === 0) {
      const comment = await Comment.create({
        content,
        userId: req.user.id,
        postId,
      });

      res.json({ code: 200, msg: "Commentaire créé.", data: { comment }, errors });
    } else {
      res.json({ code: 403, msg: "Impossible de créer le commentaire", data: {}, errors });
    }

  }

  static async deleteComment(req, res, next) {
    const { commentId } = req.params;

    const isAdmin = req.user.roleId === 1;
    const condition = isAdmin ? { id: commentId } : { id: commentId, userId: req.user.id };

    await Comment.destroy({
      where: condition,
    });
    res.json({ code: 200, msg: 'Commentaire supprimé.', data: {}, errors: [] });
  }

  static async modifyComment(req, res, next) {
    const { content } = req.body;
    const { commentId } = req.params;
    const errors = [];

    if (!content) {
      errors.push('Merci de renseigner un contenu.');
    }

    if (errors.length === 0) {
      const payload = {
        content,
      };

      const comment = await Comment.update(payload, {
        where: { id: commentId, userId: req.user.id },
        returning: true,
        plain: true,
      });

      res.json({ code: 200, msg: "Commentaire modifié.", data: { comment }, errors });
    } else {
      res.json({ code: 403, msg: "Impossible de modifier le comentaire.", data: {}, errors });
    }
  }
}

export default CommentController;