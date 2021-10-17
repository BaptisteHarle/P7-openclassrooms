export default {
  user: {
    firstName(firstName) {
      return firstName && typeof firstName === 'string' && firstName.length >= 2;
    },
    lastName(lastName) {
      return lastName && typeof lastName === 'string' && lastName.length >= 2;
    },
    email(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return email && typeof email === 'string' && re.test(String(email).toLowerCase());
    },
    password(password) {
      const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$.!%*#?&]{8,}$/;
      return password && typeof password === 'string' && re.test(String(password).toLowerCase());
    },
  },
};