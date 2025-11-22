-- Query 1
INSERT INTO public.account (
    acc_firstname,
    acc_lastname,
    acc_email,
    acc_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );
-- Query 2
SELECT *
FROM public.account;
UPDATE public.account
SET acc_type = 'Admin'
WHERE acc_id = 1;
-- Query 3
DELETE FROM public.account
WHERE acc_id = 1;
-- Query 4
SELECT *
FROM public.inventory
WHERE inv_model = 'Hummer';
UPDATE inventory
SET inv_description = REPLACE(
    inv_description,
    'small interior',
    'huge interior'
  )
WHERE inv_model = 'Hummer';
-- Query 5
SELECT inv_make,
  inv_model,
  clas_name
FROM inventory
  INNER JOIN classification ON inventory.clas_id = classification.clas_id
WHERE clas_name = 'Sport';
-- Query 6
SELECT inv_image,
  inv_thumbnail
FROM inventory;
UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');