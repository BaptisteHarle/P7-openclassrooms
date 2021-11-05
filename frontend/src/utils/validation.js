const validation = {
  user: {
    firstName(firstName) {
      const re = /^[a-zA-Z\s]*$/;  
      return firstName && typeof firstName === 'string' && firstName.length >= 2 && re.test(String(firstName));
    },
    lastName(lastName) {
      const re = /^[a-zA-Z\s]*$/;  
      return lastName && typeof lastName === 'string' && lastName.length >= 2 && re.test(String(lastName));
    },
    email(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return email && typeof email === 'string' && re.test(String(email).toLowerCase());
    },
    password(password) {
      const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*.#?&])[A-Za-z\d@$.!%*#?&]{8,}$/;
      return password && typeof password === 'string' && re.test(String(password).toLowerCase());
    },
  },
  post: {
    content(content) {
      return content && typeof content === 'string' && content.length > 0;
    },
    comment(comment) {
      return comment && typeof comment === 'string' && comment.length > 0;
    }
  },
};

export default validation;
