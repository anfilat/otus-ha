create table "user" (
    id bigserial not null constraint user_pkey primary key,
    login varchar(32) not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0) default NULL::timestamp without time zone
);

create table tweet (
    id bigserial not null constraint tweet_pkey primary key,
    author_id bigint constraint fk_3d660a3bf675f31b references "user",
    text varchar(140) not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0) default NULL::timestamp without time zone
);

create index idx_3d660a3bf675f31b on tweet (author_id);

create table subscription (
    id bigserial not null constraint subscription_pkey primary key,
    author_id bigint constraint fk_a3c664d3f675f31b references "user",
    follower_id bigint constraint fk_a3c664d3ac24f853 references "user",
    created_at timestamp(0) not null,
    updated_at timestamp(0) default NULL::timestamp without time zone
);

create index idx_a3c664d3f675f31b on subscription (author_id);
create index idx_a3c664d3ac24f853 on subscription (follower_id);
create unique index uniq_a3c664d3f675f31bac24f853 on subscription (author_id, follower_id);
create index idx_a3c664d3ac24f853f675f31b on subscription (follower_id, author_id);

create table feed (
    id bigserial not null constraint feed_pkey primary key,
    reader_id bigint constraint fk_234044ab1717d737 references "user",
    tweets json,
    created_at timestamp(0) not null,
    updated_at timestamp(0) default NULL::timestamp without time zone
);

comment on column feed.tweets is '(DC2Type:json_array)';

create unique index uniq_234044ab1717d737 on feed (reader_id);
