import { useEffect, useState, useContext } from "react";

import DirectionBtn from "../components/UI/DirectionBtn"
import Servings from './Servings';
import BookmarkContext from './BookmarkContext ';
import Loader from "./UI/Loader";
import useKey from "./useKey";

import { FiBookmark } from "react-icons/fi";
import { MdArrowBackIos } from "react-icons/md";
import { TbClockHour3 } from "react-icons/tb";
import { FiCheck } from "react-icons/fi";


function RecipeDetails({ selectedId, handleCloseRecipe, KEY, handleSaved, savedRecipes }) {

  const [recipe, setRecipe] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const { setBookmarkCount } = useContext(BookmarkContext);


  const ingredients = recipe && recipe.ingredients
    ? recipe.ingredients.map((ing, i) => <li className='flex items-center gap-2 mr-10  ' key={i}>
      <FiCheck className='text-color-primary w-6 h-6' />
      <span>{ing.quantity}{ing.unit}</span>
      <span>{ing.description}</span>

    </li>)
    : null;

  const isSaved = savedRecipes.map(recipe => recipe.id).includes(selectedId)




  // here we created new object and then to lift it up through handleSaved() as a prop to store it in a new array which is savedRecipe []
  const onSaveRecipe = () => {

    const newSavedRecipe = {
      id: selectedId,
      title: recipe.title,
      image_url: recipe.image_url,
      publisher: recipe.publisher
      // u can write the rest of params to display it later 
    }
    handleSaved(newSavedRecipe)

    setBookmarked(!bookmarked);

    // this for updating the savedRecipes Num by useContext()
    setBookmarkCount((prevCount) => bookmarked ? prevCount - 1 : prevCount + 1);

  }



  //! fetching data by ID

  useEffect(() => {
    setBookmarked(false);

    // No error handling (because mostly it gives the result like we are sure) so we add only loading 
    async function fetchRecipeDetails() {

      try {
        setIsLoading(true);


        const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${selectedId}?key=${KEY}`);

        // console.log("Data u got", response)


        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setRecipe(data.data.recipe)
        // console.log(data.data.recipe)


        setIsLoading(false)


      } catch (error) {
        console.error(error.message);

      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipeDetails();

  }, [KEY, selectedId]) // we wrote it in "Dependency array" because as the selected Id changes then the effect will be executed again, so It's Important

  // ! To change the title of the Page 

  useEffect(() => {
    if (!recipe.title) return;
    document.title = `Recipe l ${recipe.title}`;

    // we need cleanUp function when the side effect keep running, it means in that case even when we closed the RecipeDetails window but the title still there
    return function () {
      document.title = "CookSaver (walid)"
      // console.log(`Cleaned up ${recipe.title}`)
    }

  }, [recipe.title]) // we called it here because in the beginning before the fetch is called the recipe data was an empty object. so our effect is listening to the title to change  so when it does change the our effect is executed again

  //! Handling keypress event 
  useKey('Escape', handleCloseRecipe)


  return (

    <div className='col-start-2 col-end-4 h-[750px] mb-10 select-none bg-color-grey-light-1 rounded-br-xl'>
      {isLoading ? <div className="mt-32"><Loader /></div> :
        (<>
          <header className="h-[250px] flex justify-between">
            <div style={{ backgroundImage: `url(${recipe.image_url})` }} className='w-full bg-cover bg-no-repeat bg-center object-cover relative'>

              <button className='rounded-full p-2 bg-gradient-to-br from-color-primary to-color-grad-1 cursor-pointer transition-all ease-in duration-150 opacity-75 hover:opacity-100 m-2' onClick={handleCloseRecipe}>
                <MdArrowBackIos className='text-white w-7 h-7 ml-2' />
              </button>

              <div className='bg-gradient-to-br from-color-primary to-color-grad-1 px-6 rounded-bl-xl right-0 opacity-90 top-0 absolute'>
                <p className=' logo-font text-white font-semibold text-[40px] opacity-100'>
                  {recipe.title}
                </p>
              </div>

              <div className='absolute left-0 bottom-0 bg-gradient-to-br from-color-primary to-color-grad-1 opacity-90 rounded-tr-xl'>
                <div className="flex gap-12 py-2 px-6 text-white">
                  <div className='flex items-center font-semibold'>
                    <TbClockHour3 className='text-white w-6 h-6 mr-3' />
                    <span className='mr-4'>{recipe.cooking_time}</span>
                    <p>MIN</p>
                  </div>


                  <Servings servings={recipe.servings} />


                  {!isSaved

                    ?

                    <div className='py-2' onClick={onSaveRecipe}>
                      <FiBookmark className=' text-white w-6 h-6 cursor-pointer transition-all ease-in duration-150 opacity-100 hover:opacity-50' />
                    </div>

                    :

                    <div className='py-2'>
                      <FiBookmark className='fill-white text-white w-6 h-6' />
                    </div>
                  }

                </div>
              </div>

            </div>


          </header>

          <section>


            {/* RECIPE INGREDIENTS  */}

            <div className='center flex-col py-8 bg-color-grey-light-2 w-full h-full'>
              <h2 className=' text-color-primary font-bold text-xl justify-center'>RECIPE INGREDIENTS</h2>

              <ul className='pt-10 w-[90%] h-[200px]  flex  flex-wrap  justify-between items-left  text-gray-600 gap-5 overflow-y-scroll custom-scrollbar'>

                {/* ingredients is saved on the top to make a checking condition because it has an issue with map() 
                we needed to make sure that the data we're trying to map over is defined before we try to use the map function. 
                */}
                {ingredients}

              </ul>

            </div>

            {/* HOW TO COOK IT  */}

            <div className='center flex-col py-8 bg-color-grey-light-1 w-full gap-5 rounded-br-xl'>
              <h2 className=' text-color-primary  font-bold text-xl justify-center'>HOW TO COOK IT</h2>
              <p className='text-gray-600 w-[90%] text-center'>This recipe was carefully designed and tested by <span className='font-bold'>{recipe.publisher}</span>. Please check out directions at their website.</p>
              <DirectionBtn url={recipe.source_url} />
            </div>

          </section>
        </>
        )
      }

    </div >
  )
}

export default RecipeDetails
