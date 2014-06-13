require 'test_helper'

class InfolistsControllerTest < ActionController::TestCase
  setup do
    @infolist = infolists(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:infolists)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create infolist" do
    assert_difference('Infolist.count') do
      post :create, infolist: { contact: @infolist.contact, lat: @infolist.lat, long: @infolist.long, nonce: @infolist.nonce, nym: @infolist.nym, radius: @infolist.radius }
    end

    assert_redirected_to infolist_path(assigns(:infolist))
  end

  test "should show infolist" do
    get :show, id: @infolist
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @infolist
    assert_response :success
  end

  test "should update infolist" do
    patch :update, id: @infolist, infolist: { contact: @infolist.contact, lat: @infolist.lat, long: @infolist.long, nonce: @infolist.nonce, nym: @infolist.nym, radius: @infolist.radius }
    assert_redirected_to infolist_path(assigns(:infolist))
  end

  test "should destroy infolist" do
    assert_difference('Infolist.count', -1) do
      delete :destroy, id: @infolist
    end

    assert_redirected_to infolists_path
  end
end
