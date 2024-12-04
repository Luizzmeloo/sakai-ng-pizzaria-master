import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Ensure AngularFire is installed
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private collectionName = 'users'; // Replace with your Firestore collection name

  constructor(private firestore: AngularFirestore) {}

  /**
   * Get the profile of the logged-in user by their ID.
   * @param userId The unique ID of the user (e.g., Firebase Auth UID).
   */
  getProfile(userId: string): Observable<any> {
    return this.firestore.doc(`${this.collectionName}/${userId}`).valueChanges();
  }

  /**
   * Update the profile of the logged-in user.
   * @param userId The unique ID of the user (e.g., Firebase Auth UID).
   * @param profile The updated profile data.
   */
  updateProfile(userId: string, profile: any): Promise<void> {
    return this.firestore.doc(`${this.collectionName}/${userId}`).update(profile);
  }

  /**
   * Create a new user profile in Firestore.
   * @param userId The unique ID of the user (e.g., Firebase Auth UID).
   * @param profile The profile data to save.
   */
  createProfile(userId: string, profile: any): Promise<void> {
    return this.firestore.doc(`${this.collectionName}/${userId}`).set(profile);
  }

  /**
   * Delete a user profile from Firestore.
   * @param userId The unique ID of the user (e.g., Firebase Auth UID).
   */
  deleteProfile(userId: string): Promise<void> {
    return this.firestore.doc(`${this.collectionName}/${userId}`).delete();
  }
}
