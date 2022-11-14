const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({
        name: card.name, link: card.link, owner: card.owner, _id: card._id, likes: card.likes,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCardId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным ID не найдена'));
      }
      if (String(req.user._id) !== String(card.owner)) {
        return next(new ForbiddenError('Нет доступа'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((cardItem) => res.status(200).send({ data: cardItem, message: 'Карточка  удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Эта карточка не принадлежит данному ID'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий ID карточки'));
      }
      return res.status(200).send({ card, likes: card.likes.length });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка при поставке лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий ID карточки'));
      }
      return res.status(200).send({ card, likes: card.likes.length });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка при поставке лайка'));
      } else {
        next(err);
      }
    });
};
