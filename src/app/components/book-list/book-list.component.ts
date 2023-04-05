import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { BookService } from 'src/app/Service/book.service';
import { Book } from 'src/app/model/Book';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResponseModel } from 'src/app/model/ResponseModel';
import { GetBookResponseModel } from 'src/app/model/GetBookResponseModel';
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

  books: Book[] = [];
  selectedBook!: Book
  searchForm!: FormGroup;
  addBookForm!: FormGroup;
  viewBookForm!:FormGroup
  isLoading = false;
  isAdding = false;
  isUpdating = false;
  isDeleting = false;
  errorMsg!: string
  successMsg!: string
  isShowDetails = false
  constructor(private bookService: BookService, private formBuilder: FormBuilder,private modalService: NgbModal) { }
  isShowAdd = false
  isAscSort = true
  @ViewChild('addBookModal', { static: false }) addBookModal:any;
  @ViewChild('viewBookModal', { static: false }) viewBookModal:any;
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: ''
    });
    this.addBookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year: ['', Validators.required]
    });
    this.viewBookForm = this.formBuilder.group({
      bookId:['',Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      year: ['', Validators.required]
    });
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks()
      .subscribe(
        (data) => {
          this.books = data.data;
          this.isLoading = false;
        },
        (error) => {
          this.errorMsg = 'Failed to load books';
          this.isLoading = false;
        }
      );
  }

  searchBooks(): void {
    // this.loadBooks()
    console.log(this.searchForm)
    const term = this.searchForm.get('searchTerm')?.value;
    console.log(term)
    this.isLoading = true;
    if (term) {
      const filteredByTitleAndAuthor = this.books.filter(book => book.title.toLowerCase().includes(term.toLowerCase()) || book.author.toLowerCase().includes(term.toLowerCase()));
      this.books = [...filteredByTitleAndAuthor];
    } else {
      this.books = [];
    }
    this.isLoading = false
    // this.bookService.searchBooks(term)
    //   .subscribe(
    //     (data) => {
    //       this.books = data;
    //       this.isLoading = false;
    //     },
    //     (error) => {
    //       this.errorMsg = 'Failed to search books';
    //       this.isLoading = false;
    //     }
    //   );
  }

  showDetails(id: number,content: any): void {
    this.isLoading = true;
    console.log(id)
    this.bookService.getBook(id)
      .subscribe(
        (data:GetBookResponseModel) => {
          // show book details in modal
          console.log(data+ "   "+JSON.stringify(data))
          console.log(data.data+" 98")
          this.selectedBook = JSON.parse(JSON.stringify(data)).data
          console.log(this.selectedBook)
          this.isLoading = false;
          this.viewBookForm = this.formBuilder.group({
            bookId: [this.selectedBook.id,Validators.required],
            title: [this.selectedBook.title, Validators.required],
            author: [this.selectedBook.author, Validators.required],
            year: [this.selectedBook.year, Validators.required]
          });
          this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        },
        (error) => {
          this.errorMsg = 'Failed to load book details';
          this.isLoading = false;
        }
      );
      console.log(this.selectedBook+"  116")
      console.log(this.viewBookForm)
  }

  addBook(): void {
    this.isAdding = true;
    console.log(this.addBookForm.value)
    console.log(this.addBookForm.valid)
    console.log(this.addBookForm)
    if (this.addBookForm.valid) {
      // console.log(this.addBookForm.value.id)
      // if (this.addBookForm.value.id) {
      //   const newBook = {
      //     id: this.addBookForm.value.id,
      //     title: this.addBookForm.value.title,
      //     author: this.addBookForm.value.author,
      //     year: this.addBookForm.value.year
      //   };
      //   const index = this.books.findIndex(book => book.id === this.addBookForm.value.id);
      //   if (index !== -1) {
      //     this.books[index] = newBook;
      //   }
      // }
      // else {
        const newBook = {
          id: Math.floor(Math.random() * (100000 - 1 + 1)) + 1,
          title: this.addBookForm.value.title,
          author: this.addBookForm.value.author,
          year: this.addBookForm.value.year
        };
        this.books.push(newBook); // Add the new book to the list
        this.addBookForm.reset();
        console.log(newBook)

      }
    
    // this.isShowAdd = !this.isShowAdd
    this.isAdding = false
    // this.bookService.addBook(this.addBookForm.value)
    //   .subscribe(
    //     (data) => {
    //       this.books.push(data);
    //       this.successMsg = 'Book added successfully';
    //       this.isAdding = false;
    //     },
    //     (error) => {
    //       this.errorMsg = 'Failed to add book';
    //       this.isAdding = false;
    //     }
    //   );
  }

  updateBook(): void {
    this.isUpdating = true;
    const newBook = {
      id: this.viewBookForm.value.bookId,
      title: this.viewBookForm.value.title,
      author: this.viewBookForm.value.author,
      year: this.viewBookForm.value.year
    };
    const index = this.books.findIndex(book => book.id === this.viewBookForm.value.bookId);
    console.log(index)
        if (index !== -1) {
          this.books[index] = newBook;
        }
    console.log(this.books)
    
    this.isUpdating = false;
  }

  deleteBook(id: number): void {
    this.isDeleting = true;
    this.books = this.books.filter(book => book.id !== id);
    this.isDeleting = false;
    // this.bookService.deleteBook(id)
    //   .subscribe(
    //     (data) => {
    //       this.books = this.books.filter(b => b.id !== id);
    //       this.successMsg = 'Book deleted successfully';
    //       this.isDeleting = false;
    //     },
    //     (error) => {
    //       this.errorMsg = 'Failed to delete book';
    //       this.isDeleting = false;
    //     }
    //   );
  }

  sortBooks(field: string) {
    // Sort the books array by the selected field
    if (this.isAscSort) {
      if (field === 'title') {
        this.books.sort((a, b) => a.title.localeCompare(b.title));
      } else if (field === 'author') {
        this.books.sort((a, b) => a.author.localeCompare(b.author));
      } else if (field === 'year') {
        this.books.sort((a, b) => a.year - b.year);
      }
    } else {
      if (field === 'title') {
        this.books.sort((a, b) => b.title.localeCompare(a.title));
      } else if (field === 'author') {
        this.books.sort((a, b) => b.author.localeCompare(a.author));
      } else if (field === 'year') {
        this.books.sort((a, b) => b.year - a.year);
      }
    }
    this.isAscSort = !this.isAscSort
  }
  showBookDetails(){
    this.isShowDetails = !this.isShowDetails
  }
 
  openAddBookModal() {
    this.modalService.open(this.addBookModal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  closeResult!: string;
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: ''}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
}
}
