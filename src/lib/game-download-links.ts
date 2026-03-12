export const DEMO_GDRIVE_URL =
  'https://drive.google.com/uc?export=download&id=1FGmdJm6tNJ2elEs-2Zbr8FdnHwCScx1b';

export const PAID_GDRIVE_URL =
  'https://drive.google.com/uc?export=download&id=1FGmdJm6tNJ2elEs-2Zbr8FdnHwCScx1b';

export function getDownloadUrl(version: 'demo' | 'paid') {
  return version === 'paid' ? PAID_GDRIVE_URL : DEMO_GDRIVE_URL;
}
