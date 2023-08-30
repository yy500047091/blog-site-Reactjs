import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Form, Input, Label, Button, Container } from "reactstrap";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { getCurrentUserDetail } from "../auth";
import { loadAllCategories, createCategory, createPost as doCreatePost, uploadPostImage } from "../services/post-service";

const AddPost = () => {
  const editor = useRef(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(undefined);
  const [post, setPost] = useState({
    title: "",
    content: "",
    categoryId: "",
  });
  const [image, setImage] = useState(null);
  const [newCategoryTitle, setNewCategoryTitle] = useState(""); // State to hold new category title
  const [newCategoryDescription, setNewCategoryDescription] = useState(""); // State to hold new category description

  useEffect(() => {
    setUser(getCurrentUserDetail());
    loadAllCategories()
      .then((data) => {
        console.log(data);
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fieldChanged = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const contentFieldChanged = (data) => {
    setPost({ ...post, content: data });
  };

  const createPost = (event) => {
    event.preventDefault();

    if (post.title.trim() === "") {
      toast.error("Post title is required !!");
      return;
    }

    if (post.content.trim() === "") {
      toast.error("Post content is required !!");
      return;
    }

    if (post.categoryId === "") {
      toast.error("Select some category !!");
      return;
    }

    post.userId = user.id;
    doCreatePost(post)
      .then((data) => {
        if (image) {
          uploadPostImage(image, data.postId)
            .then((data) => {
              toast.success("Image Uploaded !!");
            })
            .catch((error) => {
              toast.error("Error in uploading image");
              console.log(error);
            });
        }

        toast.success("Post Created !!");
        setPost({
          title: "",
          content: "",
          categoryId: "",
        });
      })
      .catch((error) => {
        toast.error("Post not created due to some error !!");
      });
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const createNewCategory = () => {
    if (newCategoryTitle.trim() === "") {
      toast.error("Category title is required !!");
      return;
    }

    if (newCategoryDescription.trim() === "") {
      toast.error("Category description is required !!");
      return;
    }

    const categoryData = {
      categoryTitle: newCategoryTitle,
      categoryDescription: newCategoryDescription,
    };

    createCategory(categoryData)
      .then((data) => {
        toast.success("Category added successfully !!");
        setCategories([...categories, data]); // Update the categories state with the new category
        setNewCategoryTitle("");
        setNewCategoryDescription("");
      })
      .catch((error) => {
        toast.error("Error adding category !!");
        console.log(error);
      });
  };

  return (
    <div className="wrapper">
      <Card className="shadow-sm border-0 mt-2">
        <CardBody>
          <h3>What's going on in your mind?</h3>
          <Form onSubmit={createPost}>
            {/* Existing form elements */}
            <div className="my-3">
              <Label for="title">Post title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter here"
                className="rounded-0"
                name="title"
                value={post.title}
                onChange={fieldChanged}
              />
            </div>
            <div className="my-3">
              <Label for="content">Post Content</Label>
              <JoditEditor ref={editor} value={post.content} onChange={(newContent) => contentFieldChanged(newContent)} />
            </div>
            <div className="mt-3">
              <Label for="image">Select Post banner</Label>
              <Input id="image" type="file" onChange={handleFileChange} />
            </div>
            <div className="my-3">
              <Label for="category">Post Category</Label>
              <Input
                type="select"
                id="category"
                placeholder="Enter here"
                className="rounded-0"
                name="categoryId"
                onChange={fieldChanged}
                value={post.categoryId}
              >
                <option disabled value={0}>
                  --Select category--
                </option>
                {categories.map((category) => (
                  <option value={category.categoryId} key={category.categoryId}>
                    {category.categoryTitle}
                  </option>
                ))}
              </Input>
            </div>
            {/* Form to add a new category */}
          <div className="my-3">
            <Label for="newCategoryTitle">New Category Title</Label>
            <Input
              type="text"
              id="newCategoryTitle"
              placeholder="Enter new category title"
              className="rounded-0"
              name="newCategoryTitle"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
            />
          </div>
          <div className="my-3">
            <Label for="newCategoryDescription">New Category Description</Label>
            <JoditEditor
              value={newCategoryDescription}
              onChange={(newContent) => setNewCategoryDescription(newContent)}
            />
          </div>
          <Button onClick={createNewCategory} color="primary" className="rounded-0">
            Add New Category
          </Button>
            <Container className="text-center">
              <Button type="submit" className="rounded-0" color="primary">
                Create Post
              </Button>
              <Button className="rounded-0 ms-2" color="danger">
                Reset Content
              </Button>
            </Container>
          </Form>
          
        </CardBody>
      </Card>
    </div>
  );
};

export default AddPost;
