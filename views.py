from flask import Blueprint, render_template, request, jsonify, redirect, url_for

views = Blueprint('views', __name__)

@views.route("/")
def home():
    return render_template('home.html')

@views.route("/ocean")
def ocean():
    return render_template('ocean.html')

@views.route("/analogy-earth")
def analogyEarth():
    return render_template('earth2.html')

@views.route("/resources")
def resources():
    return render_template('resources.html')

@views.route("/city")
def city():
    return render_template('cartoon-City.html')

@views.route("/activities")
def activity():
    return render_template('activity.html')

@views.route("/carbon_dioxide_calculator")
def activity():
    return render_template('carbon_dioxide_calculator.html')

@views.route("/ocean_trivia_quiz")
def activity():
    return render_template('ocean_trivia_quiz.html')

@views.route("/simulation")
def activity():
    return render_template('simulation.html')

@views.route("/videos")
def activity():
    return render_template('videos.html')

@views.route("/additional_activities")
def activity():
    return render_template('additional_activities.html')


