import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
    // posts = [
    //     { title: 'First Post', content: 'This is First post\'s content' },
    //     { title: 'Second Post', content: 'This is Second post\'s content' },
    //     { title: 'Third Post', content: 'This is Third post\'s content' }
    // ];
    isLoading = false;
    posts: Post[] = [];
    private postsSub: Subscription;

    constructor(public postsService: PostsService) { }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdateListener().subscribe(
            (posts: Post[]) => {
                this.isLoading = false;
                this.posts = posts;
            }
        );
        console.log("####################    " + "3333333333333333333333");
    }

    onDelete(postID: string) {
        this.postsService.deletePost(postID);
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe();
    }
}   