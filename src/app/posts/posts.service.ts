import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';     //event emitter
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

import { Post } from "./post.model";
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) { }


    getPosts() {
        // spread operator to make a true copy
        // return [...this.posts];
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    };
                });
            }))
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
        //converting _id to id before we subscribe using observable operators
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
    }

    addPost(id: string, title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
            .subscribe((responseData) => {
                const post: Post = {
                    id: responseData.post.id,
                    title: title,
                    content: content,
                    imagePath: responseData.post.imagePath
                }
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });

    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof image === "object") {
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image
            };
        }
        this.http.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe(response => {
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                const post: Post = {
                    id: id,
                    title: title,
                    content: content,
                    imagePath: ""
                };
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts])
                this.router.navigate(["/"]);
            });
    }

    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts])
            });
    }
}