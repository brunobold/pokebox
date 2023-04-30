import Link from 'next/link';
import { redirect } from 'next/navigation';

import createClient from 'src/lib/supabase-server';

export default async function ProfileUpload() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

    // Define the bucket name and path where you want to store the file
    const bucketName = 'pokebox-user';
    const filePath = `${user.id}/`
    const file = `./test-save.sav`;

    // Upload the file to Supabase
    supabase.storage.from(bucketName).upload(filePath, file).then(response => {
      console.log('File uploaded successfully:', response);
    }).catch(error => {
      console.error('Error uploading file:', error);
    });

  return (
    <div className="card">
      <h2>File Upload</h2>
      <h3 className="highlight">{user.email}</h3>
      <h4 className="highlight">User ID: {user.id}</h4>
      <Link className="button" href="/">
        Go Home
      </Link>
    </div>
  );
}