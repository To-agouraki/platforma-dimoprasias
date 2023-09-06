import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/components/context/auth-context';

const UpdateCategory = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedCategory, setLoadedCategory] = useState();
  const categoryId = useParams().categoryId;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/admin/getCategory/${categoryId}`
        );
        setLoadedCategory(responseData.category);
        setFormData(
          {
            name: {
              value: responseData.category.name,
              isValid: true
            },
            description: {
              value: responseData.category.description,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchCategory();
  }, [sendRequest, categoryId, setFormData]);

  const categoryUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/admin/updateCategory/${categoryId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
        }
      );
      navigate('/categories');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedCategory && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find category!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedCategory && (
        <form className="place-form" onSubmit={categoryUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedCategory.name}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedCategory.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.inputs.name.isValid || !formState.inputs.description.isValid}>
            UPDATE CATEGORY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateCategory;
