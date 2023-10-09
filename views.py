from flask import Blueprint, render_template

views = Blueprint('views', __name__)

@views.route("/")  # Home
def home():
    return render_template('home.html')

@views.route("/ocean")  # Ocean view
def ocean():
    return render_template('ocean.html')

@views.route("/analogy-earth")  # Earth analogy
def analogyEarth():
    return render_template('earth2.html')

@views.route("/resources")  # Resources
def resources():
    return render_template('resources.html')

@views.route("/city")  # City view
def city():
    return render_template('cartoon-City.html')

@views.route("/activities")  # Activities
def activities():
    return render_template('activity.html')

@views.route("/carbon-dioxide-calculator")  # CO2 calculator
def carbon():
    return render_template('carbon-dioxide-calculator.html')

@views.route("/ocean-trivia-quiz")  # Quiz
def quiz():
    return render_template('ocean-trivia-quiz.html')

@views.route("/simulation")  # Simulation
def sim():
    return render_template('simulation.html')

@views.route("/videos")  # Videos
def vid():
    return render_template('videos.html')

@views.route("/additional-activities")  # More activities
def add():
    return render_template('additional-activities.html')
