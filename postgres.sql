--create table carts (
--	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--	created_at date NOT NULL,
--	updated_at date NOT NULL
--)

--create table cart_items (
--	product_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--	cart_id uuid,
--	count integer,
--	foreign key ("cart_id") references "carts" ("id")
--)

--insert into carts (created_at, updated_at) values
--(current_timestamp, current_timestamp)
--(current_timestamp, current_timestamp)

insert into cart_items (cart_id, count) values
('d0b01a8a-81d5-460e-afd6-cf993241ca8d', 1),
('d0b01a8a-81d5-460e-afd6-cf993241ca8d', 2),
('8cc2f7af-2f42-42b8-8229-3c38cf315649', 3),
('8cc2f7af-2f42-42b8-8229-3c38cf315649', 4)

select * from cart_items
where cart_id = '8ae7e1ea-d757-4264-876d-a463402912c4'

--CREATE EXTENSION IF NOT EXISTS "uuid-ossp"