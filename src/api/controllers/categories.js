/**
 * Blog Category Controller
 * handles every blog category related task
 */

// importing services
import dotenv from 'dotenv';
import models from '../models';
// import {
//   sendMessage,
//   emailTemplate
// } from '../utils';
import paginate from '../utils/paginate';

dotenv.config();

export const categories = {
  /**
   * create - create a single category
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  create(req, res) {
    const { name, desc } = req.body;
    return models.Categories
      .create({
        name: name.trim(),
        desc
      })
      .then((newCategory) => {
        res.status(201).json({
          newCategory
        });
      })
      .catch((err) => {
        // handle errors
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * edit - edit a single category
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  edit(req, res) {
    const { categoryId } = req.params;
    return models.Categories
      .findOne({
        where: { id: categoryId }
      })
      .then((foundCategory) => {
        if (foundCategory) {
          foundCategory.update({
            name: req.body.name || foundCategory.name,
            desc: req.body.desc || foundCategory.desc,
          })
            .then(() => {
              res.status(201).json({
                foundCategory
              });
            })
            .catch((err) => {
              if (err) {
                err = {
                  error: {
                    message: err.errors[0].message
                  }
                };
                return res.status(500).json(err);
              }
            });
        }
      })
      .catch((err) => {
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * delete - delete a single category
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  delete(req, res) {
    const { categoryId } = req.params;
    return models.Categories
      .findOne({
        where: { id: categoryId }
      })
      .then((foundCategory) => {
        if (foundCategory) {
          models.Categories.destroy({
            where: {
              id: categoryId
            }
          })
            .then(() => {
              res.status(201).json({
                message: 'This category has been deleted'
              });
            })
            .catch((err) => {
              if (err) {
                err = {
                  error: {
                    message: err.errors[0].message
                  }
                };
                return res.status(500).json(err);
              }
            });
        }
      })
      .catch((err) => {
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * viewById - view a single category by id
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  viewById(req, res) {
    const { categoryId } = req.params;
    return models.Categories
      .findOne({
        where: { id: (categoryId || 1) }
      })
      .then((foundCategory) => {
        if (foundCategory) {
          res.status(200).json({
            foundCategory
          });
        }
      })
      .catch((err) => {
        if (err) {
          err = {
            error: {
              message: err.errors[0].message
            }
          };
          return res.status(500).json(err);
        }
      });
  },

  /**
   * viewAll - view all categories
   *
   * @param {object} req
   * @param {object} res
   *
   * @return {object} user - data
   */
  viewAll(req, res) {
    const limitValue = req.query.limit || 100;
    const pageValue = (req.query.page - 1) || 0;
    return models.Categories
      .findAndCountAll({
        limit: limitValue,
        offset: pageValue * limitValue
      })
      .then((allCategory) => {
        const size = allCategory.rows.length;
        return res.status(200).json({
          pagination: paginate(allCategory.count - 1, limitValue, pageValue, size),
          categories: allCategory.rows
        });
      })
      .catch(err => res.status(400).json({ err }));
  }
};
