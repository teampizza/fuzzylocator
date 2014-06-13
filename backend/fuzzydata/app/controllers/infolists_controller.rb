class InfolistsController < ApplicationController
  before_action :set_infolist, only: [:show, :edit, :update, :destroy]

  # GET /infolists
  # GET /infolists.json
  def index
    @infolists = Infolist.all
  end

  # GET /infolists/1
  # GET /infolists/1.json
  def show
  end

  # GET /infolists/new
  def new
    @infolist = Infolist.new
  end

  # GET /infolists/1/edit
  def edit
  end

  # POST /infolists
  # POST /infolists.json
  def create
    @infolist = Infolist.new(infolist_params)

    respond_to do |format|
      if @infolist.save
        format.html { redirect_to @infolist, notice: 'Infolist was successfully created.' }
        format.json { render action: 'show', status: :created, location: @infolist }
      else
        format.html { render action: 'new' }
        format.json { render json: @infolist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /infolists/1
  # PATCH/PUT /infolists/1.json
  def update
    respond_to do |format|
      if @infolist.update(infolist_params)
        format.html { redirect_to @infolist, notice: 'Infolist was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @infolist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /infolists/1
  # DELETE /infolists/1.json
  def destroy
    @infolist.destroy
    respond_to do |format|
      format.html { redirect_to infolists_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_infolist
      @infolist = Infolist.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def infolist_params
      params.require(:infolist).permit(:nym, :contact, :lat, :long, :radius)
    end
end
