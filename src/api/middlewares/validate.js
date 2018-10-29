export const validate = {
  /**
   * validate user input Function on signUp form
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  signUp(req, res, next) {
    if (!req.body.email || req.body.email.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'email cannot be empty' }
        });
    }
    if (!req.body.username || req.body.username.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'username cannot be empty' }
        });
    }

    if (!req.body.password || req.body.password.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'password cannot be empty' }
        });
    }

    if (req.body.username.length < 2) {
      return res.status(400)
        .json({
          error: {
            message: 'username must be atleast 2 characters or more'
          }
        });
    }

    if (req.body.password.length < 6) {
      return res.status(400)
        .json({ error: {
          message: 'password must be 6 characters or more'
        }
        });
    }

    next();
  },

  /**
   * validate user input Function on signIn form
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  signIn(req, res, next) {
    if (!req.body.identifier || req.body.identifier.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Username or Email is required' }
        });
    }
    if (!req.body.password || req.body.password.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Password is required' }
        });
    }
    if (req.body.password.length < 6) {
      return res.status(400)
        .json({ error: {
          message: 'password must be 8 characters or more'
        }
        });
    }
    next();
  },

  /**
   * validate user input on category creation
   *
   * @param {object} req
   * @param {object} res
   * @param {func} next
   *
   * @return {void}
   */
  createCategory(req, res, next) {
    if (!req.body.name || req.body.name.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Category Name is required' }
        });
    }
    next();
  },

  /**
    * validate user input on category creation
    *
    * @param {object} req
    * @param {object} res
    * @param {func} next
    *
    * @return {void}
    */
  createPost(req, res, next) {
    if (!req.body.title || req.body.title.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Post Title is required' }
        });
    }
    if (!req.body.categories || req.body.categories.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Atleast one category is required' }
        });
    }
    if (req.body.desc.trim().length > 250) {
      return res.status(400)
        .json({
          error: { message: 'Description cannot exceed 250 words' }
        });
    }
    next();
  },

  /**
    * validate user input on contact sending
    *
    * @param {object} req
    * @param {object} res
    * @param {func} next
    *
    * @return {void}
    */
  contactDetail(req, res, next) {
    if (!req.body.email || req.body.email.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Valid email is required' }
        });
    }
    if (!req.body.fullName || req.body.fullName.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Fullname is required' }
        });
    }
    if (!req.body.message || req.body.message.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Message is required' }
        });
    }
    next();
  },

  /**
    * validate user input on subscription
    *
    * @param {object} req
    * @param {object} res
    * @param {func} next
    *
    * @return {void}
    */
  subscribeDetail(req, res, next) {
    if (!req.body.email || req.body.email.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'Valid email is required' }
        });
    }
    next();
  },

  /**
  * validate user input on editting Profile
  *
  * @param {object} req
  * @param {object} res
  * @param {func} next
  *
  * @return {void}
  */
  editProfile(req, res, next) {
    if (req.body.firstName && req.body.firstName.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'firstName cannot be empty' }
        });
    }
    if (req.body.lastName && req.body.lastName.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'lastName cannot be empty' }
        });
    }
    if (req.body.phoneNumber && req.body.phoneNumber.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'phoneNumber cannot be empty' }
        });
    }
    if (req.body.dob && req.body.dob.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'dob cannot be empty' }
        });
    }
    if (req.body.gender && req.body.gender.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'gender cannot be empty' }
        });
    }
    if (req.body.initials && req.body.initials.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'initials cannot be empty' }
        });
    }
    if (req.body.profilePic && req.body.profilePic.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'profilePic cannot be empty' }
        });
    }
    if (req.body.roleId && req.body.roleId.trim() === '') {
      return res.status(400)
        .json({
          error: { message: 'roleId cannot be empty' }
        });
    }
    next();
  }
};
