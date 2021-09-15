create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer,
	image text
)


insert into products (title, description, price, image) values
('Surly Long Haul Trucker', 'Long distance cargo bike ready to go anywhere.', 1350, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/1.jpg'),
('Kona Sutra 2022', 'It’s functional. It’s stylish. It’s incredibly versatile.', 2399, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/2.jpg'),
('Thorn Sherpa', 'Strong small-wheeled tourer.', 1599, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/3.jpg'),
('TREK 520 DISC', 'Steel touring bike made for the open road.', 1799, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/4.jpg'),
('Ridgeback Panorama', 'Fully kitted-out tourer with good gearing and quality tyres.', 1699, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/5.jpg'),
('Salsa Marrakesh Brooks', 'Best for heading off road.', 1350, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/6.jpg'),
('Fuji Touring LTD', 'Strong and comfortable to ride.', 1299, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/7.jpg'),
('Specialized AWOL Expert', 'Built to take you far away.', 2500, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/8.jpg'),
('Co-op Cycles ADV 1.1', 'Incredible components for the money.', 1549, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/9.jpg'),
('Tommaso Sterrata', 'Italian Design And Top-Notch Engineering.', 925, 'https://touring-bikes.s3.eu-west-1.amazonaws.com/10.jpg')


create table if not exists stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
)

insert into stocks (product_id, count) values
('f9160593-8694-4fcd-9230-6623a089e86c', 10),
('7f1b04cb-d3cc-4d93-80ff-c4539549ff50', 3),
('76b0b8d5-fd43-411d-8c1d-48a647a8a9b4', 4),
('058fc609-1076-484a-b81a-cd8c9554d477', 1),
('b9add3d6-74f0-44f9-b323-2b3f615afe79', 2),
('315cdd97-62c9-4012-8586-9a90bdd86c61', 7),
('86b666d9-6fe8-4a7d-923c-f621cdee8f52', 8),
('489f6d16-e528-4460-8983-ba54657eebcd', 1),
('a6520e17-d135-4206-811e-41656a1f464d', 5),
('411da606-6982-4a71-bb57-666fee1e6b57', 3)
