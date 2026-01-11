-- Query 1: Insert Tony Stark into account table
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );

-- Query 2: Select all accounts and update Tony Stark to Admin
SELECT *
FROM public.account;

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Query 3: Delete Tony Stark from account table
DELETE FROM public.account
WHERE account_id = 1;

-- Query 4: Select Hummer and update its description
SELECT *
FROM public.inventory
WHERE inv_model = 'Hummer';

UPDATE inventory
SET inv_description = REPLACE(
    inv_description,
    'small interiors',
    'huge interior'
  )
WHERE inv_model = 'Hummer';

-- Query 5: Select Sport vehicles with classification info
SELECT inv_make,
  inv_model,
  classification_name
FROM inventory
  INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- Query 6: Select image paths and update them
SELECT inv_image,
  inv_thumbnail
FROM inventory;

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');