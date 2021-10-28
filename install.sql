-- Table: public.roles

-- DROP TABLE public.roles;

CREATE TABLE IF NOT EXISTS public.roles
(
    id integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE public.roles
    OWNER to nbdovkzivnaphw;

-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    salt character varying(255) COLLATE pg_catalog."default",
    "firstName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "roleId" integer,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId")
        REFERENCES public.roles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to nbdovkzivnaphw;

-- Table: public.posts

-- DROP TABLE public.posts;

CREATE TABLE IF NOT EXISTS public.posts
(
    id integer NOT NULL DEFAULT nextval('posts_id_seq'::regclass),
    content character varying(255) COLLATE pg_catalog."default" NOT NULL,
    img character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL DEFAULT '2021-10-26 09:44:14.664+00'::timestamp with time zone,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" integer,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE public.posts
    OWNER to nbdovkzivnaphw;

-- Table: public.comments

-- DROP TABLE public.comments;

CREATE TABLE IF NOT EXISTS public.comments
(
    id integer NOT NULL DEFAULT nextval('comments_id_seq'::regclass),
    "createdAt" timestamp with time zone NOT NULL DEFAULT '2021-10-26 09:44:14.655+00'::timestamp with time zone,
    content character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "postId" integer,
    "userId" integer,
    CONSTRAINT comments_pkey PRIMARY KEY (id),
    CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId")
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE public.comments
    OWNER to nbdovkzivnaphw;