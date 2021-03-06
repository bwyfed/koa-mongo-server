
// Load the module dependencies
const User = require('mongoose').model('User')
const MicroCode = require('mongoose').model('MicroCode')

// Create a new error handling controller method
const getErrorMessage = err => {
  // Define the error message variable
  let message = ''

  // If an internal MongoDB error occurs get the error message
  if (err.code) {
    switch (err.code) {
      // If an unique index error occurs set the message error
      case 11000:
      case 11001:
        message = 'Username already exists'
        break
      // If a general error occurs set the message error
      default:
        message = 'Something went wrong'
    }
  } else {
    // Grab the first error message from a list of possible errors
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message
    }
  }

  // Return the message error
  return message
}

// Create a new controller method that renders the signin page
exports.renderSignin = async (ctx, next) => {
  // If user is not connected render the signin page, otherwise redirect the user back to the main appliaction page
  console.log(`render signin,ctx.isUnauthenticated():${ctx.isUnauthenticated()}`)
  if (ctx.isUnauthenticated()) {
    ctx.state = {
      title: 'Sign-in Page'
    }
    // render the signin page
    await ctx.render('signin', ctx.state)
  } else {
    return ctx.redirect('/')
  }
}

// Create a signin test controller
exports.signintest = async (ctx, next) => {
  console.log(111)
  const passport = require('koa-passport')
  const LocalStrategy = require('passport-local').Strategy
  // 定义passport处理用户信息的方法
  console.log(`222 start serializeUser`)
  passport.serializeUser((user, done) => {
    console.log(`serializeUser, user.id ${user.id}`)
    done(null, user.id)
  })
  console.log(`333 start deserializeUser`)
  passport.deserializeUser(async (id, done) => {
    console.log(`deserializeUser, id ${id}`)
    const query = User.findOne({_id: id}, '-passport -salt')
    await query.exec()
          .then(user => {
            console.log(`fetch user info by id from db. id ${user._id}`)
            done(null, user)
          })
          .catch(err => {
            done(err)
          })
  })
  // 注册了策略
  console.log(`444 start register local strategy`)
  passport.use(new LocalStrategy(async (username, password, done) => {
    console.log(`in local strategy, username ${username}, password ${password}`)
    const query = User.findOne({ username: username }) 
    const promise = query.exec()
    await promise.then((userDoc) => {
      console.log(`start authenticate`)
      if (!userDoc) { return done(null, false, {message: 'Unknown user'}); }
      if (!userDoc.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' })
      }
      console.log(`authenticate success`)
      return done(null, userDoc)
    })
    .catch(err => {
      return done(err);
    })
    


  }))
  
}

// Create a mirco code signin controller
exports.microsignin = async (ctx, next) => {
  console.log('/microSign, start passport.authenticate')
  console.log(ctx.request.body)
  if (ctx.request.body && ctx.request.body.password) {
    const code = ctx.request.body.password
    const query = MicroCode.findOne({code})
    await query.exec()
    .then((res)=>{
      console.log('findOne,doc:'+res)
      if(null === res) {
        // 数据库中不存在此文档，则需新建一个文档并插入
        return new MicroCode({code, token:'new'})
      } else {
        // 否则会返回成功
        ctx.body = {result: true}
        return false
      }
    })
    .then((newDoc) => {
      console.log('newDoc')
      console.log(newDoc)
      if(newDoc) {
        return newDoc.save()
      }
      return false
    })
    .then((saveDoc) => {
      if(saveDoc) {
        console.log('save success')
        ctx.body = {success: true}
      }
    })
    .catch (err => console.log(err))
  } else {
    console.log('no password pass')
    ctx.redirect('/signin')
  }
  
}

// Create a new controller method that renders the signup page
exports.renderSignup = async (ctx, next) => {
  // If user is not connected render the signup page, otherwise redirect the user back to the main application page
  console.log(`render signup,ctx.isUnauthenticated():${ctx.isUnauthenticated()}`)
  if (ctx.isUnauthenticated()) {
    ctx.state = {
      title: 'Sign-up Page'
    }
    // render the signup page
    await ctx.render('signup', ctx.state)
  } else {
    return ctx.redirect('/')
  }
}
// Create a new controller method that creates new 'regular' users
exports.signup = async (ctx, next) => {
  // If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
  console.log(`signup,ctx.isUnauthenticated():${ctx.isUnauthenticated()}`)
  if (ctx.isUnauthenticated()) {
    console.log('new user model, ctx.request.body',ctx.request.body)
    // Create a new 'User' model instance
    const user = new User(ctx.request.body)
    let message
    // Set the user provider property
    user.provider = 'local'
    // Try saving the new user document
    console.log('before user.save')
    await user.save()
      .then(
        async doc => {
          // If the user was created successfully, use the Passport 'login' method to login
          console.log('call ctx.login')
          await ctx.login(user)
                  .then(()=>{
                    //Redirect the user back to the main application page
                    console.log('login success')
                    ctx.redirect('/')
                  })
                  .catch(err => next(err))
          
        },
      )
      .catch(err => {
        console.log('err on save',err)
        // Use the error handling method to get the error message
        message = getErrorMessage(err)
        // Redirect the user back to the signup page
        ctx.redirect('/signup')
      })
    console.log('after user.save')
  } else {
    return ctx.redirect('/')
  }
}

// Create a new controller method for signing out
exports.signout = (ctx) => {
  console.log('signout')
  // Use the Passport 'logout' method to logout
  ctx.logout()
  // Redirect the user back to the main application page
	ctx.redirect('/');
}

